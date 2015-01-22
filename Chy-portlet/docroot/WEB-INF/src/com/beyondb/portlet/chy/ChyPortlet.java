package com.beyondb.portlet.chy;

import java.io.IOException;

import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import com.beyondb.jsonp.getdata.GetRemoData;
import com.liferay.util.bridges.mvc.MVCPortlet;

/**
 * Portlet implementation class ChyPortlet
 */
public class ChyPortlet extends MVCPortlet {

	@Override
	public void doView(RenderRequest renderRequest,
			RenderResponse renderResponse) throws IOException, PortletException {
		// TODO Auto-generated method stub
		GetRemoData grd=new GetRemoData();
		String chystr=grd.getStr();
		renderRequest.setAttribute("chystr", chystr);
		super.doView(renderRequest, renderResponse);
	}
 

}
