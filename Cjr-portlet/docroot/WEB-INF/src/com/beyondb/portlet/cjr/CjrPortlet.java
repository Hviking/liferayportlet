package com.beyondb.portlet.cjr;

import java.io.IOException;

import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import com.beyondb.jsonp.getdata.GetRemoData;
import com.liferay.util.bridges.mvc.MVCPortlet;

/**
 * Portlet implementation class CjrPortlet
 */
public class CjrPortlet extends MVCPortlet {

	@Override
	public void doView(RenderRequest renderRequest,
			RenderResponse renderResponse) throws IOException, PortletException {
		// TODO Auto-generated method stub
		GetRemoData grd=new GetRemoData();
		String cjrstr=grd.getStr();
		renderRequest.setAttribute("cjrstr", cjrstr);
		super.doView(renderRequest, renderResponse);
	}
 

}
